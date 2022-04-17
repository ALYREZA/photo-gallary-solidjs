import { Component, createSignal, Match, Switch } from "solid-js";
import { IItem } from "./App";
import randomColor from "randomcolor";

interface IImage {
	url: string;
	alt?: string;
	loaded?: (val: boolean) => void;
	className?: string;
	onError?: (val: boolean) => void;
}

const Img: Component<IImage> = ({ url, alt, loaded, className, onError }) => {
	return (
		<img
			onLoad={({ target: { complete } }: any) => loaded(complete)}
			onerror={() => onError(true)}
			alt={alt}
			src={url}
			class={`z-0 object-cover object-center w-full h-full ${className}`}
		/>
	);
};

const Item: Component<IItem> = (item) => {
	const [loading, setLoad] = createSignal(false);
	const [loadError, setError] = createSignal(false);
	const bgColor = randomColor({
		luminosity: "light",
		hue: "random",
	});
	const txtColor = randomColor({
		luminosity: "dark",
		hue: "random",
	});
	return (
		<div
			style={{ "background-color": !loading() ? bgColor : "#fff" }}
			class={`overflow-hidden relative w-96 z-10 h-96 rounded-md shadow-lg laptop:w-60 laptop:h-60 tablet:w-52 tablet:h-52 mobile:w-32 mobile:h-32 hover:shadow-2xl my-2`}
		>
			<Switch>
				<Match when={loadError()}>
					<div class="flex justify-center items-center">
						<span style={{ color: "red" }}>Does not loaded Successfully</span>
					</div>
				</Match>
				<Match when={!loadError()}>
					{!loading() && (
						<div class="flex justify-center items-center">
							<span style={{ color: txtColor }}>Loading ....</span>
						</div>
					)}
					<Img
						className={
							!loading() ? " grayscale-0 blur-none" : " grayscale blur-sm"
						}
						loaded={setLoad}
						url={item.image_url}
						onError={setError}
					/>
				</Match>
			</Switch>
			<span class="hidden">
				{item.name} {"\n"} {item.description}
			</span>
		</div>
	);
};

export default Item;
