import Plyr from 'plyr-react';
import { useParams } from 'react-router-dom';
import { ApiKey } from '../../../constants/appConstants';
import { Fragment, useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';

export const VideoPlayer = () => {
    const { id } = useParams();
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (id) {
            window[ApiKey].getEntity(id).then((result: EntityModel) => {
                setVideoSrc(result.path);
            });
        }
    }, [id]);

    return (
        <Fragment>
            {videoSrc && (
                <Plyr
                    source={{
                        type: 'video',
                        title: 'Example title',
                        sources: [
                            {
                                src: 'file://' + videoSrc,
                                type: 'video/mp4'
                            }
                        ]
                    }}
                    options={{ autoplay: true, ratio: '16:9' }}
                />
            )}
        </Fragment>
    );
};
