function exibir(){
    var req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(this.readyState == 3){
            alert("-- Status --\n PROCESSANDO");
        }
        if(this.readyState == 4 && this.status == 200){
            var div_content = document.getElementById("dados");
            div_content.innerHTML = this.responseText;
        }
    }
    req.open("GET", "dados.txt", true);
    req.send()
}