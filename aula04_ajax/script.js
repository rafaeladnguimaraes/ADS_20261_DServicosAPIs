function read(){
    var req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(this.readyState == 3){
            alert("-- Status --\n Servidor processando sua requisição...");
        }
        if(this.readyState == 4 && this.status == 200){
            var div_content = document.getElementById("content");
            div_content.innerHTML = this.responseText;
        }
    }
    req.open("GET", "informations.txt", true);
    req.send()
}

function generate(){
    var valor = document.getElementById("txtnumber").value;
    var div = document.getElementById("div_number");
    var req = new XMLHttpRequest();
    div.innerHTML = "Carregando...";

    req.onreadystatechange = function(){
    //    if(this.readyState == 3){
    //         alert("-- Status --\n Servidor processando sua requisição...");
    //     }
    
        if(this.readyState == 4 && this.status == 200){
            div.innerHTML = this.responseText;
        }
    }
    req.open("GET", "server.php?numero=" + valor, true);
    req.send()

}