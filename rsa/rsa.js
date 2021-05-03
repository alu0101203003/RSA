
// --------------- Funciones principales ----------------- \\

function generar (){
  
  var datos = get_datos();
  var p = datos.p;
  var q = datos.q;
  var d = datos.d;
  var m = datos.m;

  var salida = RSA (p,q,d,m);
  console.log(salida)
  imprimirSalida(salida)
}

// --------------------------------------------------------- \\

function get_datos (){

    var p = parseInt(document.getElementById("p").value);
    var q = parseInt(document.getElementById("q").value);
    var d = parseInt(document.getElementById("d").value);
    var m = document.getElementById("m").value;
    m = m.toUpperCase().split(" ").join("");    
        
	var datos = { 
		p: p,
    q: q,
    d: d,
    m: m
	};
	return datos;
}

// -------------- Funcion RSA --------------- \\

function RSA (p,q,d,m){
  var check = comprobaciones(p,q,d);
  if (check == false){
    return false
  }
  var texto = codTexto(p,q,d,m);

  var salida = {
    check: true,
    n_inv: check.n_inv,
    e: check.e,
    n: check.n,
    caracteres: texto.caracteres,
    bloques_decimal: texto.bloques_decimal,
    cifrado: texto.cifrado    
  }

  return salida
}

// -------------- Codificación texto --------------- \\

function codTexto (p,q,d,m){
  var n = comprobaciones(p,q,d).n;
  var e = comprobaciones(p,q,d).e;

  var alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  var caracteres = Math.floor(Math.log(n) / Math.log(26));
  var letras_to_num = [];
  var bloques_decimal = ""
  for (var i = 0; i < m.length; i = i + caracteres) {
    var letra_num = 0;
    var aux = caracteres - 1;
    for (var j = 0; j < caracteres; j++){
      letra_num = alfabeto.indexOf(m[i + j]) * Math.pow(26, aux) + letra_num;
      aux = aux -1
    }
    bloques_decimal = bloques_decimal + "," + letra_num.toString();
    letras_to_num.push(letra_num)
  }

  var cifrado_array = [];
  var cifrado = ""
  for (var i = 0; i < letras_to_num.length; i++) {
    cifrado_array.push(fastModExp(n,letras_to_num[i],e));
    cifrado = cifrado + cifrado_array[i].toString() + ',';
  }

  var datos = {
    caracteres: caracteres,
    bloques_decimal: bloques_decimal.substring(1),
    cifrado: cifrado.slice(0, -1)
  }
  return datos
}

// ---------------- Comprobaciones ------------------ \\

function comprobaciones (p,q,d) {
  var n = p*q
  var n_inv = (p - 1) * (q - 1)
  var e = inverso(d,n_inv)

  if (!lehmanPeralta(p)){
    console.log("Error. p no es primo")
    return false
  }
  if (!lehmanPeralta(q)){
    console.log("Error. q no es primo")
    return false
  }
  
  if (inverso(d,n_inv) == 0){
    var primos = [2, 3, 5, 7, 11];
    for (var i = 0; i < primos.length; i++){
      if (e == primos[i]){
        break;
      }
      if (e % primos[i] == 0){
        console.log("Error. d no es primo")
        return false
      }
    }
  }

  var datos = {
    check: true,
    n_inv: n_inv,
    e: e,
    n: n,
  }
  return datos
}

// ---------------- Funciones lehmanPeralta  ------------------ \\

function lehmanPeralta (p){
  var resultado = false;
  var primos = [2, 3, 5, 7, 11];
  for (var i = 0; i < primos.length; i++){
    if (p == primos[i]){
      return true
    }
    if (p % primos[i] == 0){
      return false
    }
  }
  // Casos triviales (2 o par)
  if (p % 2 == 0){
    if (p == 2){
      resultado = true;
    } else {
      resultado = false;
    }    
  }
  // Caso impar
  else {
    var a = []
    var a_size = 0;
    if (p <= 100){
      a_size = p-2;
    } else {
      a_size = 100
    }

    for (var i = 0; i < a_size; i++){
      var aux = random(2,p-1)
      a[i] = fastModExp(p, aux, (p-1)/2);
    }

    var j = 0;
    resultado = true
    while (j < a.length){
      if (a[j] == 1){
          j++
      } else if (a[j] != p-1) {
          resultado = false;
          break;
        } else {
          j++
        }
    }
  }

  return resultado;
}

function random (min,max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// ----------------- Exponenciación rápida  ------------------ \\

function fastModExp(base, exp, mod) {
  let x = 1;
  let y = exp % base;
  while (mod > 0 && y > 1) {
      if (mod % 2 == 1) {
          x = (x * y) % base;
          mod = mod - 1;
      }
      else {
          y = (y * y) % base;
          mod = mod / 2;
      }
  }
  return x;
}

// ----------------- Calcular Inverso ------------------ \\

//calculado con algoritmo euclideo extendido

function inverso(a,b){
  var x = 0;
  if (mcd(a,b) == 1){
    var y = []
    var g = [b,a]
    var u = [1,0]
    var v = [0,1]

    var i = 1

    while (g[i] != 0) {
      y.push(Math.floor(g[i-1]/g[i]))
      g.push(g[i-1] - (y[i-1] * g[i]))
      u.push(u[i-1] - (y[i-1] * u[i]))
      v.push(v[i-1] - (y[i-1] * v[i]))
      i = i+1
    }
    if (v[i-1] < 0) {
      v[i-1] = v[i-1] + b
    }

    x = v[i-1]
  }
  return x  
}

function mcd(a, b) {
  return(b==0) ? a : mcd(b,a%b);
}

// -------------- Funcion para Imprimir ---------------- \\

function imprimirSalida(salida){
  var txt = ""

  if (salida == false){
    txt = txt + `• Error. Alguno de los parámetros introducido no es primo. <br>
                  Consultar la consola para más detalle`
  } else {
    /*
    Salida:
      • Se comprueba que p y q son primos
      • Se comprueba que d es primo con Φ(n)=2520
      • Se calcula e=179
      • Como n=2947, se divide el texto en bloques de 2 caracteres
      • Se pasa cada bloque a decimal para poder cifrar, obteniendo 312, 341, 3, 221, 121,382
      • Se calcula en decimal el texto cifrado: 2704, 2173, 0404, 2340, 1789, 2333
    */

    txt = txt + `• Se comprueba que p y q son primos <br>`
    txt = txt + `• Se comprueba que d es primo con Φ(n)=${salida.n_inv} <br>`
    txt = txt + `• Se calcula e=${salida.e} <br>`
    txt = txt + `• Como n=${salida.n}, se divide el texto en bloques de ${salida.caracteres} caracteres <br>`
    txt = txt + `• Se pasa cada bloque a decimal para poder cifrar, obteniendo ${salida.bloques_decimal} <br>`
    txt = txt + `• Se calcula en decimal el texto cifrado: ${salida.cifrado} <br>`
  }
  document.getElementById("s_salida").innerHTML = txt;

 
 var checkBox = document.getElementById("candado");
 var mostrar = document.getElementById("salida");

 if (checkBox.checked == true){
  mostrar.style.display = "block";
 } else {
  mostrar.style.display = "none";
 }

}
