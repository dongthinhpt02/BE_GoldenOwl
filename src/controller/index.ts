import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { findAllScoresBySBD, findTop10StudentsByTotalScore, categorizeAllScores } from '../service';
import { t } from 'elysia';

export const studentController = (app: Elysia) => {
    // Serve static files from the 'public' directory

    app.get('/score/:sbd', async ({ params }: { params: { sbd: string } }) => {
        const result = await findAllScoresBySBD(params.sbd);

        if (!result) {
            return {
                message: 'Không tìm thấy học sinh',
                sbd: params.sbd
            };
        }

        return result;
    }, {
        params: t.Object({
            sbd: t.String()
        })
    });

    app.get('/score/subject', async () => {
        const scoreSummary = await categorizeAllScores();

        if (!scoreSummary) {
            return {
                message: 'Không có dữ liệu điểm'
            };
        }
        return scoreSummary;
    });

    app.get('/score/top10', async () => {
        const top10Students = await findTop10StudentsByTotalScore();

        if (!top10Students) {
            return {
                message: 'Không có dữ liệu học sinh'
            };
        }

        return top10Students;
    });
};