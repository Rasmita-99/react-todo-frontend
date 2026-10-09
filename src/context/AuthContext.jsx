
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext(null);
const USERS_KEY = "todo_app_demo_accounts";
const SESSION_KEY = "todo_app_session";


// Load registered demo accounts.

function readAccounts() {
    try {
        // Read the accounts from local storage and parse them as JSON.
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
    } catch {
        // If the file does not exist or cannot be read, return an empty array.
        return []
    }
}


export function AuthProvider({ children }) {
    // Restore the previous demo session after refreshing the page.
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
        } catch {
            return null;
        }
    });


    // Keep the session synchronized with localStorage.
    useEffect(() => {
        if (user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
        // Clean up the effect when the component unmounts or when the user changes.
    }, [user]);


    // Register a new demo account.

    function register(name, email, password) {
        const accounts = readAccounts();
        // Check if the email is already registered.
        const normalizedEmail = email.trim().toLowerCase();

        if (accounts.some((account) => account.email === normalizedEmail)) {
            throw new Error("An account with this email already exists.");
        }

        const account = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "user",
        };

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify([...accounts, account])
        );

        // Never expose the password to the rest of the UI.
        const safeUser = {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
        };
        setUser(safeUser);

        return safeUser;
    }


    // Log in using a locally registered demo account.
    function login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const account = readAccounts().find(
            (item) =>
                item.email === normalizedEmail && item.password === password
        );

        if (!account) {
            throw new Error("Invalid email or password.");
        }

        const safeUser = {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
        };

        setUser(safeUser);

        return safeUser;
    }

    // Remove the current session.
    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: Boolean(user) }}>
            {children}
        </AuthContext.Provider>
    )

}

// Custom hook for using authentication state.
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}