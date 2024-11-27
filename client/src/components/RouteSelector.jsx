import {useAuth} from './AuthContext';

const RouteSelector = ({children}) => {
    const {authToken} = useAuth();
    return authToken ? children[0] : children[1];
};

export default RouteSelector;