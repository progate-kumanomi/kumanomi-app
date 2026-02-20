import { type Schema } from '@/../amplify/data/resource';
import outputs from '@/outputs';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';

export const { runWithAmplifyServerContext } = createServerRunner({
    config: outputs
});

export const cookiesClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
});
