function validar(){
    valor = document.getElementById("txtValor").value

    var divResult = document.getElementById("divResult")

    if( isNaN(valor)){
        divResult.innerHTML ="O valor digitado não é um número"

    }else if(valor < 1 || valor > 10){
        divResult.innerHTML = "O valor não é permitido"
    }else{
        divResult.innerHTML = "Valor permitido!"
    }
}

function limpar(){
    divResult = document.getElementById("divResult").innerHTML = ""
}

$("#divJquery").css("background", "#000")
$("#divJquery").css("color", "white")
$("#divJquery").html("AAAAAA <hr> AAAAAAAAA")


$("#botao").on("click", function(){
    $("#divJquery").toggle(2000, mostrarMensagem)
})

function mostrarMensagem(){
    alert("Ação finalizada")
}