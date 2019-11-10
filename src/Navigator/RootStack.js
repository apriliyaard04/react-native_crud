import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Homescreen from '../Home/Homescreen';
import Addscreen from '../Add/Addscreen';
import Editscreen from '../Edit/Editscreen';

export const RootStack = createStackNavigator(
    {
        Home: { screen: Homescreen, navigationOptions: { header: null, }, },
        Add: { screen: Addscreen },
        Edit: { screen: Editscreen }
    },
    {
        initialRouteName: 'Home',
    }
)

export default createAppContainer(RootStack);