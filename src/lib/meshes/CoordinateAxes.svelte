<script>
	import { Line } from '$lib';
</script>

<!-- x-axis -->
<Line
	points={[
		[-100_000, 0, 0],
		[100_000, 0, 0]
	]}
	material={{ color: 0xff0000 }}
/>
<!-- y-axis -->
<Line
	points={[
		[0, -100_000, 0],
		[0, 100_000, 0]
	]}
	material={{ color: 0x00ff00 }}
/>
<!-- z-axis -->
<Line
	points={[
		[0, 0, -100_000],
		[0, 0, 100_000]
	]}
	material={{ color: 0x0000ff }}
/>
