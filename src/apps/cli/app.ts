import { CliApplication } from "@core-ext/cli/CliApplication";
import { HelloWorldCliRouter } from "./routes";

new CliApplication(
    {
        name: undefined,
        run: 'single',
        ignoreArgc: 2,
        description: 'Testing application / Command line tool',
        options: [
            { name: 'Verbose', description: 'Activate logging system', type: 'boolean', default: false, short: '-v', long: '--verbose' },
            { name: 'Help', description: 'Show usage', type: 'boolean', default: false, long: '--help', short: '-h'  }
        ],
    },
    new HelloWorldCliRouter()
)
.run()