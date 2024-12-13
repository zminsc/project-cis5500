export default function Container({ children, fullWidth = false }) {
    return (
        <div className={`mx-auto ${fullWidth ? '' : 'max-w-[1024px] px-6'}`}>
            {children}
        </div>
    );
}
