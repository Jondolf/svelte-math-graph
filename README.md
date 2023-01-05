# Svelte Math Graph

> **Warning! This is an experimental work-in-progress library that I am developing for fun. Features, configuration and documentation are lacking. This may or may not turn into a proper library eventually, but currently this should only be used for experimentation.**

**Svelte Math Graph (SMG)** is a component library for creating mathematical graphs and visualizations with a declarative component-oriented API that focuses on ease of use, configurability, and extensibility.

Graphs are built using components like `<CoordinateAxes />` and `<Curve />`. Each component can be configured using props, and the graph will automatically react to any changes to these props.

Under the hood, SMG uses [three.js](https://threejs.org/) for the rendering. All of the boilerplate and technical overhead is just hidden from the user into the scripts of the components, which is very similar to what libraries like [Svelte Cubed](https://svelte-cubed.vercel.app/) and [svelthree](https://svelthree.dev/) do. This means that you get the capabilities and performance of three.js with a readable, reactive, and declarative API that can even be extended with your own components if necessary.

Parsing mathematical expressions is done with [math.js](https://mathjs.org/). Note that this is currently quite limited, and things like solving actual equations is not supported. This will hopefully change in the future.

## Usage example

**Note:** This library isn't on NPM yet, so you will have to clone it if you want to test it out.

Below is the code required to render a 3D sine wave with custom colors. Implementing this manually with pure JavaScript and three.js could be hundreds of lines of code, but with SMG it is under ten.

```svelte
<script>
  import { DirectionalLight, Graph, PerspectiveCamera, Surface } from 'svelte-math-graph';
</script>

<Graph backgroundColor={0xddeeff}>
	<PerspectiveCamera position={[20, 50, 50]} lookAt={[0, 0, 0]} />
	<DirectionalLight intensity={2} position={[0.75, 1, 0.75]} target={[0, 0, 0]} />
	<Surface equation={'sin(x)'} xSegments={50} ySegments={50} color={0x0044ff} />
</Graph>
```

This produces the following result:

![A three-dimensional graph of a sine wave](static/3d_sine_wave.png)
