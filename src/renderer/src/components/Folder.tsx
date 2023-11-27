import './Folder.scss';

type FolderProps = {
    title: string;
    onClick: () => void;
    icon: string;
    progress: number;
};

export const Folder = (props: FolderProps) => {
    const { title, onClick, icon, progress } = props;

    return (
        <button className="btn p-0 btn-folder position-relative" title={title} onClick={onClick}>
            <img src={icon} alt="folder" className="preview-img" />
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {Math.floor(progress)}%
                </div>
            </div>
            <div className="text-truncate text">{title}</div>
        </button>
    );
};
