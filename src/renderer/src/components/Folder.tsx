import './Folder.scss';

type FolderProps = {
    title: string;
    onClick: () => void;
    icon: string;
};

export const Folder = (props: FolderProps) => {
    const { title, onClick, icon } = props;

    return (
        <button className="btn p-0 btn-folder" title={title} onClick={onClick}>
            <img src={icon} alt="folder" />
            <div className="text-truncate text">{title}</div>
        </button>
    );
};
