import folderIcon from '../assets/icons/folder.svg';
import './Folder.scss';

type FolderProps = {
    title: string;
};

export const Folder = (props: FolderProps) => {
    const { title } = props;
    return (
        <button className="btn p-0 btn-folder" title={title}>
            <img src={folderIcon} alt="folder" />
            <div className="text-truncate text">{title}</div>
        </button>
    );
};
