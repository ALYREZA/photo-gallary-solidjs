import {
	Component,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	For,
} from "solid-js";
import Item from "./Item";

export interface IItem {
	page_id?: number;
	url?: string;
	canonical_url?: string;
	parent_url?: string;
	image_url?: string;
	price?: string;
	name?: string;
	product_confidence?: number;
	crawled_time?: string;
	created_time?: string;
	width?: null | number;
	height?: null | number;
	issue?: string;
	description: string;
	domain?: string;
	source?: string;
	brand?: null | string;
	slug?: string;
	tags?: string;
	price_updated?: null;
	last_update?: string;
	currency?: null | string;
	price_old?: null | string;
	discount?: null | string;
	s3_url?: null | string;
}
type ScrollEvent = UIEvent & {
	target: HTMLElement;
};

const fetchImage = async (offset: number): Promise<IItem[]> =>
	(await fetch(`https://xoosha.com/ws/1/test.php?offset=${offset}`)).json();

const App: Component = () => {
	const imgCount = 60;
	const [offset, setOffset] = createSignal<number>(1);
	const [search, setSearch] = createSignal<string>("");
	const [isLoaded, setLoading] = createSignal<boolean>(false);
	const [scrolling, setScroll] = createSignal<ScrollEvent>();
	const [data, setData] = createSignal<IItem[]>();
	const [images, { mutate }] = createResource(() => 1, fetchImage);

	createEffect(() => {
		const cloneData = images();
		setData(cloneData);
	});
	createEffect(() => {
		const cloneData = search().trim();
		console.log({ cloneData });
		if (cloneData.length > 1) {
			const newValue = createMemo(() =>
				images()?.filter((item) => item.description.indexOf(cloneData) >= 0)
			);
			setData(newValue());
		} else {
			setData(images());
		}
	});
	createEffect(() => {
		const sv = scrolling();
		const clientHeight = sv?.target.clientHeight;
		const scrollHeight = sv?.target.scrollHeight;
		const scrollTop = sv?.target.scrollTop;
		const totalHeight = scrollHeight - clientHeight - 500;
		if (scrollTop >= totalHeight && !isLoaded() && !images.loading) {
			setLoading(true);
			fetchImage(offset() + imgCount).then((res) => {
				const totalImages = [...images(), ...res];
				setOffset(offset() + imgCount);
				mutate(totalImages);
				if (search().trim().length >= 1) {
					const newValue = createMemo(() =>
						totalImages?.filter(
							(item) => item.description.indexOf(search().trim()) >= 0
						)
					);
					setData(newValue());
				} else {
					setData(totalImages);
				}
				setLoading(false);
			});
		}
	});
	return (
		<div class="relative h-screen overflow-hidden flex flex-1 z-0 justify-center items-center">
			<div class="fixed top-0 left-0 w-full h-12 bg-slate-200">
				<div class="flex flex-1 items-center justify-center pt-3">
					<input
						value={search()}
						onKeyPress={({ target: { value } }: any) => setSearch(value)}
						class=" w-1/3 h-1/2 bg-slate-300 text-cyan-700"
					/>
				</div>
			</div>
			<div
				onscroll={setScroll}
				class="grid grid-cols-3 gap-3 pl-5 max-h-screen min-w-full overflow-scroll mt-28 pb-56"
			>
				<For
					each={data()}
					fallback={
						<div class=" text-2xl text-red-500 text-center">Loading...</div>
					}
				>
					{(item) => <Item {...item} />}
				</For>
			</div>
		</div>
	);
};

export default App;
