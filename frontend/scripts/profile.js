console.log("Profile page loaded successfully!");

// =============================
// AUTH PROTECTION
// =============================

firebase.auth().onAuthStateChanged((user) => {

    if(!user){

        window.location.href = "signin.html";

        return;

    }

    loadUserProfile(user);

});

// =============================
// LOAD PROFILE
// =============================

function loadUserProfile(user){

    // Sidebar

    document.getElementById(
        "sidebar-name"
    ).innerText =
        user.displayName || "User";

    document.getElementById(
        "sidebar-email"
    ).innerText =
        user.email;

    // Form

    document.getElementById(
        "profile-name"
    ).value =
        localStorage.getItem("profileName")
        || user.displayName
        || "";

    document.getElementById(
        "profile-email"
    ).value =
        user.email || "";

    document.getElementById(
        "profile-phone"
    ).value =
        localStorage.getItem("profilePhone")
        || "";

    document.getElementById(
        "profile-address"
    ).value =
        localStorage.getItem("profileAddress")
        || "";

    document.getElementById(
        "profile-bio"
    ).value =
        localStorage.getItem("profileBio")
        || "";

    // Avatar

    const savedAvatar =
        localStorage.getItem(
            "profileAvatar"
        );

    if(savedAvatar){

        document.getElementById(
            "profile-preview"
        ).src = savedAvatar;

    }

}

// =============================
// SAVE PROFILE
// =============================

const profileForm =
    document.getElementById(
        "profile-form"
    );

profileForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        localStorage.setItem(
            "profileName",
            document.getElementById(
                "profile-name"
            ).value
        );

        localStorage.setItem(
            "profilePhone",
            document.getElementById(
                "profile-phone"
            ).value
        );

        localStorage.setItem(
            "profileAddress",
            document.getElementById(
                "profile-address"
            ).value
        );

        localStorage.setItem(
            "profileBio",
            document.getElementById(
                "profile-bio"
            ).value
        );

        document.getElementById(
            "sidebar-name"
        ).innerText =
            document.getElementById(
                "profile-name"
            ).value;

        alert(
            "Profile updated successfully!"
        );

    }
);

// =============================
// AVATAR UPLOAD
// =============================

const avatarInput =
    document.getElementById(
        "avatar-input"
    );

avatarInput.addEventListener(
    "change",
    (e) => {

        const file =
            e.target.files[0];

        if(!file) return;

        const reader =
            new FileReader();

        reader.onload = function(event){

            const image =
                event.target.result;

            document.getElementById(
                "profile-preview"
            ).src = image;

            localStorage.setItem(
                "profileAvatar",
                image
            );

        };

        reader.readAsDataURL(file);

    }
);