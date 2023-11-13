import folderIcon from '../assets/icons/folder.svg';
import './Folder.scss';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes';

type FolderProps = {
    title: string;
    id: number;
};

export const Folder = (props: FolderProps) => {
    const { title, id } = props;
    const navigate = useNavigate();
    const onClick = () => {
        const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id });
        navigate(link);
    };
    return (
        <button className="btn p-0 btn-folder" title={title} onClick={onClick}>
            <img src={folderIcon} alt="folder" />
            <div className="text-truncate text">{title}</div>
        </button>
    );
};
