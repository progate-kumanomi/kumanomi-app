import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Get the current user's Identity ID from AWS Amplify
 * Works for both authenticated and guest (unauthenticated) users
 */
export async function getCreatorId(): Promise<string> {
    try {
        const session = await fetchAuthSession();

        if (!session.identityId) {
            throw new Error('No identity ID found in session');
        }

        return session.identityId;
    } catch (error) {
        console.error('Failed to get creator ID:', error);
        throw error;
    }
}
