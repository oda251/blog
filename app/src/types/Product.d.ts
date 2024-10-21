interface Product {
	title: LangString;
	thumbnail: string;
	imgs: PrefixedAssets[];
	infras: IconString[];
	langs: IconString[];
	body: LangString;
	github: string;
	href: string;
}

interface ProductInfo{
	title: LangString;
	thumbnail: string;
	infras: IconString[];
	langs: IconString[];
	href: string;
}

interface ProductDetail {
	title: LangString;
	imgs: string[];
	infras: IconString[];
	langs: IconString[];
	body: LangString;
	github: string;
}
