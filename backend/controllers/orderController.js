const db =
    require("../config/db");

const {
    createOrderService
} = require(
    "../services/order.service"
);

const {
    safeNumber,
    safeInteger,
    sanitizeString,
    getPagination,
    buildPaginationMeta,
    safeArray
} = require(
    "../utils/helpers"
);

// create order
const createOrder =
    async (
        req,
        res
    ) => {
        let connection;
        try {
            connection = await db.getConnection();

            const {
                customer,
                address,
                paymentMethod,
                items,
                total
            } = req.body;

            // validation
            if (
                !customer
                ||
                !customer.name
                ||
                !customer.email
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Customer information required"
                    });
            }

            if (
                !address
                ||
                !address.fullAddress
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Delivery address required"
                    });
            }

            if (
                !Array.isArray(
                    items
                )
                ||
                !items.length
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Order items required"
                    });
            }

            if (
                safeNumber(total) <= 0
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid order total"
                    });
            }

            const validPaymentMethods = [
                "cod",
                "card",
                "upi",
                "paypal"
            ];

            if (
                !validPaymentMethods.includes(
                    sanitizeString(
                        paymentMethod
                    ).toLowerCase()
                )
            ) {

                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid payment method"
                    });
            }

            // create order via service
            const result =
                await createOrderService(
                    connection,
                    req.user.id,
                    items
                );

            return res.status(201)
                .json({
                    success: true,
                    message:
                        "Order placed successfully",
                    orderId:
                        result.orderId
                });

        } catch (error) {
            console.error(
                "CREATE ORDER ERROR:",
                error
            );

            return res.status(500)
                .json({
                    success: false,
                    message:
                        error.message
                        || "Failed to create order"
                });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    };

// get all orders
const getAllOrders =
    (
        req,
        res
    ) => {

        const {
            page,
            limit,
            offset
        } = getPagination(
            req.query.page,
            req.query.limit,
            50
        );

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM orders
        `;

        db.query(
            countQuery,
            (
                countError,
                countResults
            ) => {

                if (
                    countError
                ) {

                    console.error(
                        countError
                    );

                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                const total =
                    Number(
                        countResults?.[0]?.total || 0
                    );

                const query = `
                    SELECT
                        id,
                        user_id,
                        customer_name,
                        customer_email,
                        payment_method,
                        total,
                        status,
                        created_at
                    FROM orders
                    ORDER BY id DESC
                    LIMIT ?
                    OFFSET ?
                `;

                db.query(
                    query,
                    [
                        limit,
                        offset
                    ],
                    (
                        err,
                        results
                    ) => {

                        if (
                            err
                        ) {

                            console.error(
                                err
                            );

                            return res.status(500)
                                .json({
                                    success: false,
                                    message:
                                        "Server error"
                                });
                        }

                        res.status(200)
                            .json({
                                success: true,

                                page,

                                limit,

                                total,

                                ...buildPaginationMeta(
                                    total,
                                    page,
                                    limit
                                ),

                                orders:
                                    safeArray(
                                        results
                                    )
                            });
                    }
                );
            }
        );
    };

// get user orders
const getUserOrders =
    (req, res) => {
        const query = `
            SELECT
                id,
                customer_name,
                payment_method,
                total,
                status,
                created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY id DESC
        `;

        db.query(
            query,
            [req.user.id],
            (
                err,
                results
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        orders:
                            safeArray(results)
                    });
            }
        );
    };

// get order by id
const getOrderById =
    (req, res) => {
        const id =
            safeInteger(
                req.params.id
            );

        if (!id) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order ID"
                });
        }

        let query = `
            SELECT *
            FROM orders
            WHERE id = ?
        `;

        const queryParams = [
            id
        ];

        // normal users can only access own orders
        if (
            req.user.role !== "admin"
        ) {
        
            query += `
                AND user_id = ?
            `;
        
            queryParams.push(
                req.user.id
            );
        }

        db.query(
            query,
            queryParams,
            (
                err,
                results
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                if (
                    !safeArray(results).length
                ) {
                    return res.status(404)
                        .json({
                            success: false,
                            message:
                                "Order not found"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        order:
                            results[0]
                    });
            }
        );
    };

// update order status
const updateOrderStatus =
    (req, res) => {
        const id =
            safeInteger(
                req.params.id
            );

        const status =
            sanitizeString(
                req.body.status
            ).toLowerCase();

        const validStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!id) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order ID"
                });
        }

        if (
            !validStatuses.includes(
                status
            )
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order status"
                });
        }

        const query = `
            UPDATE orders
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [
                status,
                id
            ],
            (
                err,
                result
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                if (
                    !result
                    || result.affectedRows === 0
                ) {
                    return res.status(404)
                        .json({
                            success: false,
                            message:
                                "Order not found"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        message:
                            "Order status updated"
                    });
            }
        );
    };

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};