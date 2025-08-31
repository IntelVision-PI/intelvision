function verifyFields(fields){
    let valid = true;
    for(field of fields){
        if(field.value == '' || (field.getAttribute('type') == 'email' && !field.value.includes("@"))){
            field.style.borderColor = 'rgba(255, 0, 0, 1)';
            valid = false;
        }else{
            field.style.borderColor = '#00863F';
        }
    }
    return valid;
}