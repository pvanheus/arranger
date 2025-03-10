import { Client } from '@elastic/elasticsearch';

import { CONSTANTS } from '../../middleware';
import { setsMapping } from '../../schema';
import { DEBUG_MODE } from '../constants';

export const initializeSets = async ({ esClient }: { esClient: Client }): Promise<void> => {
	DEBUG_MODE &&
		console.log(` \nAttempting to create Sets index "${CONSTANTS.ES_ARRANGER_SET_INDEX}"...`);
	if (
		(await esClient.indices.exists({ index: CONSTANTS.ES_ARRANGER_SET_INDEX }))?.statusCode === 404
	) {
		const setsIndex = await esClient.indices.create({
			index: CONSTANTS.ES_ARRANGER_SET_INDEX,
			body: {
				mappings: {
					properties: setsMapping,
				},
			},
		});

		if (setsIndex) {
			DEBUG_MODE && console.log('  Success!');
			return;
		}

		throw new Error(`Problem creating ${CONSTANTS.ES_ARRANGER_SET_INDEX} index`);
	} else {
		DEBUG_MODE && console.log(`  This index already exists. Moving on!\n`);
	}
};
