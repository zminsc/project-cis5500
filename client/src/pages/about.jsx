import React, {useEffect, useState} from "react";
import { Card } from "@nextui-org/react";
import finalReport from '../assets/final_report.md'
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const teamMembers = [
    {
        name: "Steven Chang",
        role: "",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQHQ-JpMAT_i0Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1672347357610?e=1739404800&v=beta&t=uyVvIDL1u0QPYpYNpHlFQ5qZ2JAuC2nKlHvsS4gT9tg",
        description: ""
    },
    {
        name: "Mahika Calyanakoti",
        role: "",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQEv-oE0bM10iw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1690295533237?e=1739404800&v=beta&t=x6akkKeOTeeoZTvzlVexFn884cmBDUXwgxLx0zA8imk",
        description: ""
    },
    {
        name: "Logan Brassington",
        role: "",
        image: "https://media.licdn.com/dms/image/v2/C4D03AQHKoAHJ_7QcjQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1644619373946?e=1739404800&v=beta&t=ird33F8H9VHiWGhx-W6ZziSZ1joyU2VdL9_Pe34iFKg",
        description: ""
    },
    {
        name: "Cynthia Zhang",
        role: "",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQFFsLkULClcGg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1683080730489?e=1739404800&v=beta&t=uoeO-u_T3nGJMQ3lYLl62Tt0hfOnOCU4i5QcfCi7uPk",
        description: ""
    }
];

export default function AboutPage() {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch(finalReport)
            .then(response => response.text())
            .then(text => setMarkdown(text))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-10">Our Team</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((person, index) => (
                    <Card
                        key={index}
                        className="p-4 flex flex-col items-center"
                    >
                        <div className="w-32 h-32 mb-4 overflow-hidden rounded-full">
                            <img
                                src={person.image}
                                alt={person.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                        {person.role && (
                            <p className="text-gray-500 italic mb-2">{person.role}</p>
                        )}
                        {person.description && (
                            <p className="text-gray-600 text-sm text-center">{person.description}</p>
                        )}
                    </Card>
                ))}
            </div>
            <h1 className="text-3xl font-bold text-center m-10">The Project</h1>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </div>
    );
}
