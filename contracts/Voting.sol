// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structs
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        string imageUrl;
        uint256 age;
        string party;
    }

    // State Variables
    mapping(uint256 => Candidate) public candidates;
    mapping(address => uint256) public lastVotedSession;
    uint256 public candidatesCount;
    address public admin;
    uint256 public currentVotingSession;

    // Events
    event CandidateAdded(uint256 indexed id, string name, string party);
    event VoteCast(uint256 indexed candidateId, address indexed voter);
    event VotingReset(uint256 timestamp);
    event WinnerDeclared(uint256 indexed id, string name, uint256 voteCount);
    
    // Constructor
    constructor(address _admin) {
        admin = _admin != address(0) ? _admin : msg.sender;
        currentVotingSession = 1; // Start with session 1
    }

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Admin Functions
    function addCandidate(
        string memory _name,
        uint256 _age,
        string memory _party,
        string memory _imageUrl
    ) public onlyAdmin {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than 0");
        require(bytes(_party).length > 0, "Party cannot be empty");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            voteCount: 0,
            imageUrl: _imageUrl,
            age: _age,
            party: _party
        });
        
        emit CandidateAdded(candidatesCount, _name, _party);
    }

    function endVotingAndReset() public onlyAdmin {
        uint256 winningVoteCount = 0;
        uint256 winnerId = 0;
        string memory winnerName = "";
        
        // Find winner
        for(uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winnerId = candidates[i].id;
                winnerName = candidates[i].name;
            }
        }
        
        // Emit winner if there were any candidates
        if (candidatesCount > 0) {
            emit WinnerDeclared(winnerId, winnerName, winningVoteCount);
        }
        
        // Reset all votes and voting status
        for(uint256 i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        
        candidatesCount = 0;
        currentVotingSession++; // Increment session ID to reset voting status
        
        emit VotingReset(block.timestamp);
    }

    // Voting Functions
    function vote(uint256 _candidateId) public {
        require(lastVotedSession[msg.sender] < currentVotingSession, "You have already voted in this session");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        lastVotedSession[msg.sender] = currentVotingSession;
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(_candidateId, msg.sender);
    }

    // View Functions
    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        uint256 voteCount,
        string memory imageUrl,
        uint256 age,
        string memory party
    ) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        Candidate memory candidate = candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.voteCount,
            candidate.imageUrl,
            candidate.age,
            candidate.party
        );
    }

    function hasUserVoted(address _voter) public view returns (bool) {
        return lastVotedSession[_voter] == currentVotingSession;
    }

    // Add this new function
    function getWinner() public view returns (uint256, string memory, uint256) {
        require(candidatesCount > 0, "No candidates registered");
        
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
        
        require(winningCandidateId > 0, "No votes cast");
        return (
            winningCandidateId,
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }
}