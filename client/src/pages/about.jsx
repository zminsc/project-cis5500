import React from "react";

export default function AboutPage() {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Team</h1>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
                {[
                    { name: "Steven Chang", role: "", image: "https://media.licdn.com/dms/image/v2/D4E03AQHQ-JpMAT_i0Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1672347357610?e=1739404800&v=beta&t=uyVvIDL1u0QPYpYNpHlFQ5qZ2JAuC2nKlHvsS4gT9tg", description: "" },
                    { name: "Mahika Calyanakoti", role: "", image: "https://media.licdn.com/dms/image/v2/D4E03AQEv-oE0bM10iw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1690295533237?e=1739404800&v=beta&t=x6akkKeOTeeoZTvzlVexFn884cmBDUXwgxLx0zA8imk", description: "" },
                    { name: "Logan Brassington", role: "", image: "https://media.licdn.com/dms/image/v2/C4D03AQHKoAHJ_7QcjQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1644619373946?e=1739404800&v=beta&t=ird33F8H9VHiWGhx-W6ZziSZ1joyU2VdL9_Pe34iFKg", description: "" },
                    { name: "Cynthia Zhang", role: "", image: "https://media.licdn.com/dms/image/v2/D4E03AQFFsLkULClcGg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1683080730489?e=1739404800&v=beta&t=uoeO-u_T3nGJMQ3lYLl62Tt0hfOnOCU4i5QcfCi7uPk", description: "" }
                ].map((person, index) => (
                    <div key={index} style={{ textAlign: "center", marginBottom: "20px", maxWidth: "200px" }}>
                        <img 
                            src={person.image} 
                            alt={person.name} 
                            style={{ borderRadius: "50%", width: "150px", height: "150px" }}
                        />
                        <h3 style={{ margin: "10px 0" }}>{person.name}</h3>
                        <p style={{ fontStyle: "italic", color: "gray" }}>{person.role}</p>
                        <p>{person.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
