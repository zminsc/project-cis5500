import {Link} from "@nextui-org/react";

export default function GridItem({ recipeItem }) {
    const imgClassName = `p-4 bg-[url(${recipeItem.url})] bg-cover bg-center flex-grow`

    return (
        <div className="w-64 h-64 rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col h-full">
                <div
                    className={imgClassName}
                    style={{ flex: '4 1 0%' }}>
                </div>
                <div
                    className="p-4 bg-white flex-grow"
                    style={{ flex: '1 1 0%' }}>
                    <h1 className={"font-bold text-xl"}>{recipeItem.name}</h1>
                    <Link href={"#"} className={"text-sm underline-offset-2 underline text-customTertiary"}>View Recipe</Link>
                </div>
            </div>
        </div>
    );
}