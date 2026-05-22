console.log("Profile page loaded successfully!");

// AUTH PROTECTION
const token = localStorage.getItem("token");
const user = JSON.parse(
    localStorage.getItem("user")
);

if (!token || !user) {
    window.location.href = "signin.html";
} else {
    loadUserProfile(user);
}

// LOAD PROFILE
function loadUserProfile(user){

    // Sidebar
    const sidebarName =
        document.getElementById(
            "sidebar-name"
        );

    const sidebarEmail =
        document.getElementById(
            "sidebar-email"
        );

    if (sidebarName) {
        sidebarName.innerText =
            user.name || "User";
    }

    if (sidebarEmail) {
        sidebarEmail.innerText =
            user.email || "";
    }

    // Form
    const profileName =
        document.getElementById(
            "profile-name"
        );

    const profileEmail =
        document.getElementById(
            "profile-email"
        );

    const profilePhone =
        document.getElementById(
            "profile-phone"
        );

    const profileAddress =
        document.getElementById(
            "profile-address"
        );

    const profileBio =
        document.getElementById(
            "profile-bio"
        );

    if (profileName) {
        profileName.value =
            localStorage.getItem(
                "profileName"
            ) ||
            user.name ||
            "";
    }

    if (profileEmail) {
        profileEmail.value =
            user.email || "";
    }

    if (profilePhone) {
        profilePhone.value =
            localStorage.getItem(
                "profilePhone"
            ) || "";
    }

    if (profileAddress) {
        profileAddress.value =
            localStorage.getItem(
                "profileAddress"
            ) || "";
    }

    if (profileBio) {
        profileBio.value =
            localStorage.getItem(
                "profileBio"
            ) || "";
    }

    // Avatar
    const savedAvatar =
        localStorage.getItem(
            "profileAvatar"
        );

    const profilePreview =
        document.getElementById(
            "profile-preview"
        );

    if (
        savedAvatar &&
        profilePreview
    ) {
        profilePreview.src =
            savedAvatar;
    }

}

// SAVE PROFILE
const profileForm =
    document.getElementById(
        "profile-form"
    );

if (profileForm) {
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

        if (typeof notify === "function") {
            notify(
                "Profile updated successfully!",
                "success"
            );
        } else {
            alert(
                "Profile updated successfully!"
            );
        }
    }
);
}

// AVATAR UPLOAD
const avatarInput =
    document.getElementById(
        "avatar-input"
    );

if (avatarInput) {
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

            const profilePreview =
                document.getElementById(
                    "profile-preview"
                );
            
            if (profilePreview) {
                profilePreview.src =
                    image;
            }

            localStorage.setItem(
                "profileAvatar",
                image
            );
        };
        reader.readAsDataURL(file);
    }
);
}