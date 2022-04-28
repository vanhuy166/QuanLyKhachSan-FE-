$(document).ready(function() {
    if (!sessionStorage.getItem("token")) {
        hideMenuLogin();
    } else {
        showMenuLogin();
    }
});

// đổi mật khẩu
function showDoiMK() {
    $("#modal").css("display", "block");
}

function hideDoiMK() {
    $("#modal").css("display", "none");
    $('#txtEmail').val("");
    $('#txtNewPass').val("");
    $('#txtRe_NewPass').val("");
}

function DoiMatKhau() {
    var headers = "Bearer " + sessionStorage.getItem("token");
    $.ajax({
        url: 'http://localhost:8083/api/v1/users/info',
        headers: {
            "Authorization": headers
        },
        method: 'GET',
        contentType: 'application/json',
        error: function(err) {
            console.log(err);
        },
        success: function(data) {
            if (data.email != $('#txtEmail').val()) {
                alert("Email không chính xác!");
                return;
            }

            if ($('#txtNewPass').val().trim() == "") {
                alert("Mật khẩu không được để trống!");
                return;
            }

            if ($('#txtNewPass').val() != $('#txtRe_NewPass').val()) {
                alert("Mật khẩu không khớp!");
                return;
            }

            var newUser = {
                "id": data.id,
                "password": $('#txtNewPass').val()
            }

            idUser = data.id;
            $.ajax({
                url: 'http://localhost:8083/api/v1/users/update',
                headers: {
                    "Authorization": headers
                },
                method: 'PUT',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(newUser),
                error: function(err) {
                    alert("Đổi mật khẩu không thành công!");
                    console.log(err);
                },
                success: function(data) {
                    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại!");
                    //window.location = window.location.href;
                    window.location = "./index.html"
                    DangXuat()
                },
                fail: function(response) {}
            });

        },
        fail: function(response) {}
    });
}


// menu đăng nhập
function showMenuLogin() {
    $("#MenuLogin.MenuLogin").css("display", "none");
    $("#MenuUser.MenuUser").css("display", "inline-block");
}

function hideMenuLogin() {
    $("#MenuLogin.MenuLogin").css("display", "inline-block");
    $("#MenuUser.MenuUser").css("display", "none");
}

//Form đăng ký , đăng nhập
function showFormDangKy() {
    $("#usernameDK").val("");
    $("#passwordDK").val("");
    $("#emailDK").val("");
    $("#modalDangNhap").css("display", "block");
    $("#formDangKy").css("display", "block");
    $("#formDangNhap").css("display", "none");
}

function showFormDangNhap() {
    $("#username").val("");
    $("#password").val("");
    $("#modalDangNhap").css("display", "block");
    $("#formDangKy").css("display", "none");
    $("#formDangNhap").css("display", "block");
}

// đăng ký , đăng nhập , đăng xuất
function hideDangNhap() {
    $("#modalDangNhap").css("display", "none");
}

function DangNhap() {

    var data = {
        "username": $("#username").val(),
        "password": $("#password").val(),
    };

    $.ajax({
        url: 'http://localhost:8083/api/v1/users/login',
        type: 'POST',
        data: JSON.stringify(data),
        error: function(err) {
            console.log('Error!', err)
            alert("Đăng nhập thất bại!");
        },
        success: function(data) {
            var token = data.token;
            var role = parseJwt(token);
            if (role.authorities[0].authority == "ROLE_USER") {
                sessionStorage.setItem("token", token);
                showMenuLogin();
                hideDangNhap();
            } else {
                alert("Đăng nhập thất bại!");
            }
        }
    });
}

function DangKy() {
    var data = {
        "username": $("#usernameDK").val(),
        "email": $("#emailDK").val(),
        "password": $("#passwordDK").val()
    };

    $.ajax({
        url: 'http://localhost:8083/api/v1/users/register',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        error: function(err) {
            console.log('Error!', err)
            alert("Đăng ký thất bại!");
        },
        success: function(data) {
            alert("Đăng ký thành công.");
            showFormDangNhap();
        }
    });
}

function DangXuat() {
    sessionStorage.removeItem("token");
    hideMenuLogin();
}

// đăng nhập với google
function LoginWithGoogle() {
    $.ajax({
        url: 'http://localhost:8083/api/v1/users/login/oauth',
        type: 'POST',
        error: function(err) {
            console.log('Error!', err)
            alert("Đăng nhập thất bại!");
        },
        success: function(data) {
            alert("google");
        }
    });
}



function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};