function read_json(){
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj_json = JSON.parse( this.responseText);
            var txt = "Nome: " + obj_json.nome + "<br>";
            txt += "Idade: " + obj_json.idade + "<br>";
            txt += "Formações: " + obj_json.formacoes.forEach(formacao => {
                txt += formacao + " -"
            }) + "<br>";
            if(obj_json.casado){
                txt += "Conjugê: " + obj_json.conjuge.nome + "<br>";
            }
            txt += "Filhos: "; obj_json.filhos.forEach(filho =>{
                txt += "<br>" + filho.nome + ", Idade: " + filho.idade;
            });

            document.getElementById("div_json").innerHTML = txt;
        }
    }

    req.open("GET" , "dados.json" , true);
    req.send();
}

function read_products(){
    var req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj_json = JSON.parse(this.responseText);
            var products = obj_json.produtos;
            var txt = "";

            if(products,length == 0){
                txt ="<tr><th> Nenhum produto </th></tr>";
            }else{

                txt += "<tr>";
                txt += " <th> Código  </th>";
                txt += " <th> Nome  </th>";
                txt += " <th> Preço  </th>";
                txt += "<tr>";

                products.forEach(product =>{
                    txt += "<tr>";
                    txt += " <td>" + product.id + "</td>";
                    txt += " <td>" + product.nome + "</td>";
                    txt += " <td>" + product.preco + "</td>";
                    txt += "<tr>";
                })
            }
            document.getElementById("tbl_produtos").innerHTML = txt;
        }
    }

    req.open("GET" , "servidor.php?buscar" , true);
    req.send();
}