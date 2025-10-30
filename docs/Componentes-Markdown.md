# Componentes Especiales de markdown

En markdown aparte del texto con estilo, también puedes incluir componentes **HTML**, como el &#60;table&#62; o el &#60;div&#62;, pero desde Divulgando Ciencia hemos creado unos componentes especiales para darle más vida a tus artículos. Estos componentes son componentes de **Astro** así que tienen una sintaxis parecida a la de **HTML**.

## Componentes Especiales 

### Latex

Latex es un *"Lenguaje"* hecho para poder escribir fórmulas matemáticas con estilo, a través de texto normal. Por ejemplo:

`\left&#40; \sum_{k=1}^n a_k b_k \right&#41;^2 \leq \left&#40; \sum_{k=1}^n a_k^2 \right&#41; \left&#40; \sum_{k=1}^n b_k^2 \right&#41;` quedaría como

$$\left&#40; \sum_{k=1}^n a_k b_k \right&#41;^2 \leq \left&#40; \sum_{k=1}^n a_k^2 \right&#41; \left&#40; \sum_{k=1}^n b_k^2 \right&#41;$$

#### Uso

El componente se importa con `import Latex from '@/components/screwdriver/Latex.astro'` y se usa como `<Latex formula='{formula}'/>` donde `{formula}` es tu fórmula de Latex en string.

Para obtener y el código de una fórmula de Latex puedes usar páginas como [esta de aquí]&#40;https://latexeditor.lagrida.com&#41; que es gratuita y te permite visualizar tu fórmula mientras la editas.

### Console

Console es un componentes que permite ejecutar varios lenguajes de programación desde la propia web.

#### Uso

El componente se importa con `import Console from '@/components/screwdriver/Console.astro'` y se usa como `<Console code='{code}' stdin=[{stdin}] language='{language}'/>` donde `{code}` es tu código en string &#40;se recomienda usar texto con &#96;texto&#96; para poder poner código en varias líneas&#41;, `{stdin}` una lista de strings que imitan la función de stdin o más conocida como input, en lenguajes como python, y `{language}` es el lenguaje de programación que la consola va a usar &#40;por defecto python&#41;.

#### Lenguajes soportados

Divulgando Ciencia está trabajando en importar distintos lenguajes de programación, hasta el momento el único soportado es Python.

Para importar Python, a parte de poner los distintos componentes de *Console* en el artículo, al final de este hay que poner dos líneas de código que importan el emulador de Python para todo el artículo.

```
<script src="/screwdriver/pyodide.js" type="module"/>
<script src="https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js"/>
```

## Cómo hacer artículos con Componentes Especiales

Los artículos especiales deben de estar hechos en archivos ".mdx". **MDX** es igual que Markdown pero permite usar componentes personalizados. Arriba del todo, justo debajo del frontmatter &#40;los datos del artículo envueltos en `---`&#41; se ponen los *imports*, después los componentes pueden ser usados tantas veces como se desee durante todo el artículo. Ejemplo:

```
---
name: Nombre
description: Descripción
...
---
import Latex from '@/components/screwdriver/Latex.astro'
import Console from '@/components/screwdriver/Console.astro'

# Un Título
...

Mira esta fórmula

<Latex formula='\left&#40; \sum_{k=1}^n a_k b_k \right&#41;^2 \leq \left&#40; \sum_{k=1}^n a_k^2 \right&#41; \left&#40; \sum_{k=1}^n b_k^2 \right'>
...

Mira este código

<Console code={`print("¡Hola Mundo!")
a = input()
b = input()
print("Los argumentos stdin son ", a, b)`} stdin={["123", "manzana"]} language={'python'}/>
...

Y este es todo el artículo.

<script src="/screwdriver/pyodide.js" type="module"/>
<script src="https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js"/>
```