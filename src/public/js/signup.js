console.log("Signup frontend javascript file");

$(function () {
    const fileTarget = $(".file-box .upload-hidden");
    let filename;

    // Rasm yuklash va preview
    fileTarget.on("change", function () {
        if (window.FileReader) {
            const uploadFile = $(this)[0].files[0];
            if (!uploadFile) return;

            // console.log(uploadFile); - faylni xususiyatlarini korish
            const fileType = uploadFile["type"];
            const validImageType = ["image/jpg", "image/jpeg", "image/png"];
            if (!validImageType.includes(fileType)) {
                alert("Please insert only jpg, jpeg and png formats!");
                $(this).val("");

            } else {
                if (uploadFile) {
                    // URL.createObjectURL(uploadFile) - yuklangan fayl uchun blob link hosil qilish
                    // attr orqali ushlangan attributni src ni ozgartiryapmiz
                    $(".upload-img-frame")
                        .attr("src", URL.createObjectURL(uploadFile))
                        .addClass("uploaded-succes");
                }

                filename = $(this)[0].files[0].name; //faylni nomini olamiz.
            }

            $(this).siblings(".upload-name").val(filename);
        }
    })
});


// Parolni jonli tekshirish
$(".member-password, .confirm-password").on("input", function () {
    const val = $(this).val();
    const errorBox = $(".password-error");

    if (val.length === 0) {
        errorBox.hide().text("");
        $(this).css("border-color", "");
        return;
    }

    // Ketma-ket tekshiramiz: birinchi uchragan xatoni ko'rsatamiz
    if (val.length < 8) {
        errorBox.text("Parol kamida 8 ta belgidan iborat bo'lishi kerak!").show();
        $(this).css("border-color", "#e53935");
    } else if (!/[A-Z]/.test(val)) {
        errorBox.text("Kamida 1 ta katta harf bo'lishi kerak (A-Z)!").show();
        $(this).css("border-color", "#e53935");
    } else if (!/[0-9]/.test(val)) {
        errorBox.text("Kamida 1 ta raqam bo'lishi kerak (0-9)!").show();
        $(this).css("border-color", "#e53935");
    } else if (!/[@$!%*?&]/.test(val)) {
        errorBox.text("Kamida 1 ta belgi bo'lishi kerak (@, $, !, %, *, ?, &)!").show();
        $(this).css("border-color", "#e53935");
    } else {
        // Hamma shart bajarilsa yashiramiz va inputni yashil qilamiz
        errorBox.hide().text("");
        $(this).css("border-color", "#2e7d32");
    }
});

// Submit dan oldin front end ozida validatsiya qilish
function validateSignupForm() {
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (memberNick === "" ||
        memberPhone === "" ||
        memberPassword === "" ||
        confirmPassword === ""
    ) {
        alert("Please insert all required inputs!");
        return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(memberPassword)) {
        $(".member-password").focus();
        alert("Parol talablarga to'liq mos kelmayapti!");
        return false;
    }
    if (memberPassword != confirmPassword) {
        alert("Password differs, please check!");
        return false;
    }

    const memberImage = $(".member-image").get(0).files[0].name
        ? $(".member-image").get(0).files(0).name : null;
    if (!memberImage) {
        alert("Please insert restaurant image!");
        return false;
    }

    return true;

};
