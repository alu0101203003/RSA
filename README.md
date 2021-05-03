# Cifrado RSA

Esta práctica está realizada en html, css y JavaScript.

El código fuente se encuentra en la carpeta "rsa"

Se puede ejecutar abriendo el archivo index.html con un navegador (chrome recomendado).

También se puede probar de manera online en la siguiente página: [https://alu0101203003.github.io/RSA/](https://alu0101203003.github.io/RSA/)

Ejemplo de uso:

	Entrada:
		Texto original: MANDA DINEROS, p=421, q=7 y d=1619.
	Salida:
		• Se comprueba que p y q son primos
		• Se comprueba que d es primo con Φ(n)=2520
		• Se calcula e=179
		• Como n=2947, se divide el texto en bloques de 2 caracteres
		• Se pasa cada bloque a decimal para poder cifrar, obteniendo 312, 341, 3, 221, 121, 382
		• Se calcula en decimal el texto cifrado: 2704, 2173, 0404, 2340, 1789, 2333
