import { testingTranslations } from '../../restAPI';
import buttons from './buttons';
import general from './general';
import labels from './labels';
import login from './login';
import messages from './messages';

const resources = {
    ...buttons,
    ...login,
    ...general,
    ...labels,
    ...messages,
};

//compare keys if same throw error
//get keys of all objects, filter duplicates, throw them in error
if (testingTranslations) {
    const test = [
        ...Object.keys(buttons),
        ...Object.keys(login),
        ...Object.keys(general),
        ...Object.keys(labels),
        ...Object.keys(messages),
    ];

    const testResult = test.filter(
        (key, index) =>
            test.findIndex((key2) => key2 === key) !== index
    );
    if (testResult.length > 0) {
        throw new Error(
            `Some thranslations have duplicate keys: ${testResult.join(
                ', '
            )}`
        );
    }
}
export default resources;
