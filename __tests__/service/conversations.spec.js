const ServiceError = require("../../src/core/serviceError");
const conversationService = require("../../src/service/conversation");
const conversationRepository = require("../../src/repository/conversation");
const { initializeLoggerInUnitTests } = require("../helpers");


describe('Conversations', () => {
    initializeLoggerInUnitTests();
    describe('checkInConversation', () => {
        conversationRepository.findById = jest.fn().mockResolvedValue({
            id: 1,
            post: {
                id: 1,
                title: "the title of the post"
            },
            postReplier: {
                id: 1,
                username: "Pieter"
            },
            postOwner: {
                id: 2,
                username: "Bert"
            },
            deletedByPostReplier: false,
            deletedByPostOwner: false,
            messages: [{
                id: 1,
                content: "Dag Bert ik heb interesse in je zoekertje",
                sender: {
                    id: 1,
                    username: "Pieter"
                },
                timestamp: '2022-12-07 18:42:20.622'
            }]
        });

        it('should throw ServiceError.forbidden if user is not one of the users in the conversation', async () => {
            await expect(conversationService.checkInConversation(1, 3)).rejects.toThrowError(ServiceError.forbidden('You are not allowed to edit this conversation'));
            await expect(conversationService.checkInConversation(1, 25)).rejects.toThrowError(ServiceError.forbidden('You are not allowed to edit this conversation'));
            expect(conversationRepository.findById).toHaveBeenCalled();
            expect(conversationRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should not throw if user is one of the users in the conversation', async () => {
            await expect(conversationService.checkInConversation(1, 1)).resolves.not.toThrowError(ServiceError.forbidden('You are not allowed to edit this conversation'));
            await expect(conversationService.checkInConversation(1, 2)).resolves.not.toThrowError(ServiceError.forbidden('You are not allowed to edit this conversation'));
            expect(conversationRepository.findById).toHaveBeenCalled();
            expect(conversationRepository.findById).toHaveBeenCalledWith(1);
        });

    });
});