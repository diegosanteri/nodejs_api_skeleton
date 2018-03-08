import ioc from '../ioc';

export default function () {
    const applicationService = ioc.getApplicationService();

    applicationService
        .initApplication()
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
}