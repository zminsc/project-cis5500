import { Card, CardBody } from "@nextui-org/react";

export default function DataView({ data, type }) {
    if (!data || data.length === 0) return null;

    switch (type) {
        case "ingredients_category":
            return (
                <Card className="w-full">
                    <CardBody>
                        <h2 className="text-xl font-bold mb-4">Ingredients in Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {data.map((item, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded-lg">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            );
        default:
            return null;
    }
}
