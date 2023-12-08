import './Folder.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { EntityType } from '../../../models/enums/EntityType';

type FolderProps = {
    title: string;
    onClick: () => void;
    type: EntityType;
    progress: number;
};

export const Folder = (props: FolderProps) => {
    const { title, onClick, type, progress } = props;

    return (
        <button className="btn p-0 btn-folder position-relative" title={title} onClick={onClick}>
            {type === EntityType.Folder ? (
                <Icon iconSpritePath={iconDef} name="directory" width={60} height={60} />
            ) : (
                <Icon iconSpritePath={iconDef} name="video" width={60} height={60} />
            )}
            {progress !== 0 && progress !== 100 && (
                <div className="progress-container">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {progress === 100 && (
                <div className="check position-absolute">
                    <Icon iconSpritePath={iconDef} name="check" width={12} height={12} />
                </div>
            )}
            <div className="text-truncate text">{title}</div>
        </button>
    );
};
