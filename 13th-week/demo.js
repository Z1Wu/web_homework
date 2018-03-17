window.onload = main;

log = console.log;
function main() {
    let re_name = /[0-9a-zA-z]+/;
    let re_email = /^[0-9a-zA-Z]+@([0-9a-zA-Z]+\.)+[a-z]{2,}$/;
    let re_phone = /^[0-9]{3,}$/;
    let re_stu = /^[0-9]{8}$/;
    let myForm = $('form');
    let texts = $('input');
    let submit_btn = document.getElementById('submitBtn');


    function inputHandler(inputName, validCheck){
        let ele = $(inputName);
        ele.focus((event) => {
           ele.removeClass("error");
           ele.removeClass("valid");
        });
        ele.blur((event) => {
            let tar = event.target;
            if(validCheck(tar.value)) {
                ele.addClass("valid");
            } else {
                ele.addClass("error");
            }
            if(isAllValid()) {
                submit_btn.disabled = false;
            }
        })
    }

    inputHandler("#username", nameIsValid);
    inputHandler("#email", emailIsValid);
    inputHandler("#phone", phoneIsValid);
    inputHandler("#studentNumber", stuNumIsValid);

    function emailIsValid(email) {
        // log(re_email);
        return re_email.test(email);
    }
    function phoneIsValid(phone) {
        return re_phone.test(phone);
    }
    function stuNumIsValid(stuNum) {
        return re_stu.test(stuNum);
    }
    function nameIsValid(name) {
        return re_name.test(name);
    }

    function isAllValid() {
        for(let i = 0; i < texts.length - 1; i++) {
            if(!$(texts[i]).hasClass('valid')) {
                return false;
            }
        }
        return true;
    }
    myForm.submit((event) => {
        // 防止重复提交
        submit_btn.disabled = false;
    })
}