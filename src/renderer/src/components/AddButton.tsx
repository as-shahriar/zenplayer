import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import './AddButton.scss';
import { ApiKey } from '../../../constants/appConstants';

type AddButtonProps = {
    refreshList: () => void;
};
export const AddButton = (props: AddButtonProps) => {
    const { refreshList } = props;
    const getNewFolder = () => {
        window[ApiKey].selectFolder().then(() => {
            refreshList();
        });
    };

    return (
        <button
            className="btn btn-add d-flex justify-content-center align-items-center shadow-sm"
            onClick={getNewFolder}
        >
            <Icon iconSpritePath={iconDef} name="plus" width={18} height={18} />
        </button>
    );
};
