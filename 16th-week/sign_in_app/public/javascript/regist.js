window.onload = main;

log = console.log;
function main() {
    log('under control');
    $('#errScreen').hide();
    // valid rule
    const reName = /^[0-9a-zA-z]{4,10}$/;
    const reEmail = /^[0-9a-zA-Z]+@([0-9a-zA-Z]+\.)+[a-z]{2,}$/;
    const rePhone = /^[0-9]{3,}$/;
    const reStu = /^[0-9]{8}$/;
    const rePw = /^[0-9_a-zA-Z]{2,10}$/;
    let myForm = $('form');
    let submitBtn = document.getElementById('submitBtn');

    init();

    const Validator = {
        username: function(un) {
            return reName.test(un);
        },
        password: function(pw) {
            return rePw.test(pw);
        },
        pwConfirm: function(cpw) {
            log(cpw, $('#password').val());
            return cpw == $('#password').val();
        },
        phone: function(p) {
            return rePhone.test(p);
        },
        studentNumber: function(s) {
            return reStu.test(s);
        },
        email: function(e) {
            return reEmail.test(e);            
        }
    }

    const ERROR_MSGS = {
        username: {
            formatError: 'username should only contains letter and number, with length between 4 and 10',
            conflict: 'This username has been used',
        },
        password: {
            formatError: 'password should only contains letter and number, with length between 4 and 10'
        },
        pwConfirm: {
            formatError: 'what you enter are not match your your passwod.'
        },
        email: {
            formatError: 'Format error, please input valid eamil address',
            conflict: 'This email has been used',    
        },
        phone: {
            formatError: 'Format error, phone number should only contain number!',
            conflict: 'This phone number has been used',    
        },
        studentNumber: {
            formatError: 'Format error, please input valid sutdent number',
            conflict: 'This studnet has been used',    
        }
    };

    $('#username').change(inputHandler);
    $('#password').change(inputHandler);
    $('#pwConfirm').change(inputHandler);
    $('#email').change(inputHandler);
    $('#phone').change(inputHandler);
    $('#studentNumber').change(inputHandler);
    $('#resetBtn').click(init);

    function inputHandler() {
        let ele = $(this);
        let name = ele.attr('name');
        if(Validator[name](ele.val())) {
            if(name == 'password' || name == 'pwConfirm') {
                validHandler(ele);
            } else {
                let queryPair = {[name] : ele.val()};
                checkRepeat(queryPair, function(err, isRepeat){
                    if(isRepeat) {
                        invalidHandler(ele, ERROR_MSGS[name]['conflict']);
                    } else {
                        validHandler(ele);
                    }
                });
            }
        } else {
            invalidHandler(ele, ERROR_MSGS[name]['formatError']);
        }
    }

    function validHandler(ele) {
        hideErrMsg(ele);
        ele.addClass('valid');
        ele.removeClass('error');
        if(allValid()) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    function allValid() {
        // log($('.valid').length);
        return $('.valid').length == 6;
    }

    function invalidHandler(ele, errMsg) {
        ele.removeClass('valid').addClass('error');
        showErrMsg(ele, errMsg);
    }

    function checkRepeat(queryPair, callback) {
        $.get('/checkRepeat', queryPair, function(data, textStatus){
            callback(null, data.isRepeat);
        });
    }

    function showErrMsg(ele, errMsg) {
        ele.parent().parent().children('.err-msg').text(errMsg).show();
    }

    function hideErrMsg(ele) {
        ele.parent().parent().children('.err-msg').hide();
    }

    function init() {
        submitBtn.disabled = true;
        $('input').each(function() {
            hideErrMsg($(this));
            $(this).removeClass('valid').removeClass('error');
        })
    }
}