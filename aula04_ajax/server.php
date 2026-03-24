<?php

    $valor = $_GET["numero"];
    $texto = "";
    for ($i = 1; $i <= $valor; $i++){
        $texto .= "<br>" .$i;
    }
    echo $texto;