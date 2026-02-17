document.querySelectorAll('.auth__password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var wrapper = btn.closest('.auth__password-wrapper');
        var input = wrapper.querySelector('.auth__input');
        var iconEye = btn.querySelector('.auth__icon-eye');
        var iconEyeOff = btn.querySelector('.auth__icon-eye-off');

        if (input.type === 'password') {
            input.type = 'text';
            iconEye.style.display = 'none';
            iconEyeOff.style.display = 'block';
        } else {
            input.type = 'password';
            iconEye.style.display = 'block';
            iconEyeOff.style.display = 'none';
        }
    });
});
