import { EntityModel } from '../../../models/EntityModel';
import videoIcon from '../assets/icons/video.svg';
import './Playlist.scss';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes';

type PlaylistProps = {
    videoList: EntityModel[];
};

export const Playlist = (props: PlaylistProps) => {
    const { videoList } = props;
    const navigate = useNavigate();

    const onNavigateClick = (entity: EntityModel) => {
        navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
    };
    return (
        <div className="bg-white vh-100 playlist-container p-2">
            {videoList.map((video) => {
                return (
                    <button
                        className="btn btn-link text-decoration-none p-0 d-flex gap-1"
                        onClick={() => onNavigateClick(video)}
                    >
                        <img src={videoIcon} alt="folder" />
                        <span className="d-grid">
                            <span className="text-start text-truncate">{video.name}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
