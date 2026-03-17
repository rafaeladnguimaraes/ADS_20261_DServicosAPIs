var pessoa = {
    nome: "Rafa",
    sobrenome: "Guimarães",
    idade: 19,
    altura: 1.75,
    concluido: [2024, 2024, 2027],
    instituicoes: ["EEELL", "IC", "US" ],
    conjuge: {
        nome: "Daniel Magnus",
        idade: 19
    },

    getNomeCompleto : function(){
        return this.nome + " " + this.sobrenome
    }
};

function carregar(){
    var text = "Nome: " + pessoa.getNomeCompleto() + "<br>";
    text += "Idade: " + pessoa.idade + "<br>";
    text += "Cônjuge: " + pessoa.conjuge.nome + "<br>";
    text += "Ano de Conclusão: ";
    pessoa.concluido.forEach( year => {
        text += year + " - "
    });
    document.getElementById("divContents").innerHTML = text;   
}