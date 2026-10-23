console.log("Users frontend javascript file");

$(function () {
    $(".member-status").on("change", function (e) {
        const id = e.target.id,
            memberStatus = $(`#${id}.member-status`).val();
        console.log("memberstatus:", memberStatus)

        // Axios: update 
        axios.post("/admin/user/edit", {
            _id: id,
            memberStatus: memberStatus,
        }).then(response => {
            const result = response.data;

            if (result.data) {
                // console.log("User information updated!");
                $(".member-status").blur();
            } else alert("Product update failed!");

        }).catch(err => {
            console.log(err);
            alert("User update failed!")
        })
    });

});
