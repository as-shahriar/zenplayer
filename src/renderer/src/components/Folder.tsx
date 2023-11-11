import folderIcon from '../assets/icons/folder.svg';
import './Folder.scss';

type FolderProps = {};

export const Folder = (props: FolderProps) => {
    const {} = props;
    return (
        <button className="btn p-0 btn-folder">
            <img src={folderIcon} alt="folder"/>
            <div className="text-truncate text">hghjghjhghjghjhghjghjhghjghj</div>
        </button>
    );
};
