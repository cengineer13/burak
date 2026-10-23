console.log("Products frontend javascript file");

$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if (selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });

    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("process-btn").css("display", "none");
    })
    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(200);
        $("process-btn").css("display", "flex");
    })

    $(".new-product-status").on("change", async function (e) {
        const id = e.target.id;
        const productStatus = $(`#${id}.new-product-status`).val();
        console.log("id:", id);
        console.log("productStatus:", productStatus);

        try {
            const response = await axios.post(`/admin/product/${id}`, {
                productStatus: productStatus,
            });
            // console.log("response:", response);
            const result = response.data;

            if (result && result._id) {
                alert("Product status updated!");
                $(".new-product-status").blur();
            } else alert("Product update failed!");
        } catch (err) {
            console.log(err);
            alert("Product update failed!");
        }
    });

});


function validateForm() {
    const productName = $(".product-nick").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();

    if (productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === "") {
        alert("Please insert all details!");
        return false;
    }
    else {
        return true;
    }
}


function previewFileHandler(inputImg, order) {
    const imgClassName = inputImg.className;
    console.log("inputImg: ", inputImg);


    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file['type'];
    const validImageType = ["image/jpg", "image/jpeg", "image/png"];

    if (!validImageType.includes(fileType)) {
        alert("Please insert only jpg, jpeg and png formats!");

    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                $(`#image-section-${order}`).attr("src", reader.result);
            }
            reader.readAsDataURL(file);
        }
    }
}