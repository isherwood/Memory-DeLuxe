import {shallow} from 'enzyme';
import ButtonWithConfirm from './ButtonWithConfirm';

describe('ButtonWithConfirm component', () => {
    let component;

    beforeEach(() => {
        // build the component
        component = shallow(<ButtonWithConfirm/>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(component).not.toBeNull();
    });
});
