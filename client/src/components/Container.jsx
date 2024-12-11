export default function Container({ children }) {
    return (
        <div className="mx-auto max-w-[1024px] px-6">
            {children}
        </div>
    );
}
