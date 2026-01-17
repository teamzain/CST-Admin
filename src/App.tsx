import { useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { routes } from './routes';

function App() {
    const element = useRoutes(routes);
    return (
        <>
            {element}
            <Toaster />
        </>
    );
}

export default App;
