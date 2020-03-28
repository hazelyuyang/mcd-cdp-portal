import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const answerPaddingBottom = 21;
const answerAnimationTime = '350ms';

const QuestionAndAnswerStyle = styled.div`
  position: relative;

  .question-row {
    padding-top: 14px;
    padding-bottom: 18px;
    letter-spacing: 0.007em;
    position: relative;
  }

  .question {
    margin-right: 25px;
  }

  .answer {
    overflow: hidden;
    transition: max-height ${answerAnimationTime} ease,
      padding-bottom ${answerAnimationTime} ease;
    font-size: 18px;
    line-height: 29px;

    a {
      text-decoration: underline;
    }
  }

  &.active {
    .answer {
      padding-bottom: ${answerPaddingBottom}px;
    }
  }
  .plus-minus-toggle {
    cursor: pointer;
    height: 21px;
    position: absolute;
    width: 21px;
    right: 4px;
    top: 50%;
    z-index: 2;

    &:before,
    &:after {
      background: #000;
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      width: 21px;
      transition: transform ${answerAnimationTime} ease,
        opacity ${answerAnimationTime} ease;
    }

    &:after {
      transform-origin: center;
      opacity: 0;
    }
  }

  &.collapsed {
    .plus-minus-toggle {
      &:after {
        transform: rotate(90deg);
        opacity: 1;
      }

      &:before {
        transform: rotate(180deg);
      }
    }
  }
`;
function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const QuestionAndAnswer = ({ question, answer, onClick, isSelected }) => {
  const answerElement = useRef(null);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    }, 300);

    window.addEventListener('resize', debouncedHandleResize);
    setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    // set the height after fonts have probably loaded, or system font is used
    const timeoutId = setTimeout(() => {
      setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    }, 3200);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [height]);

  return (
    <QuestionAndAnswerStyle
      key={question}
      className={isSelected ? 'active' : 'collapsed'}
    >
      <div className="question-row">
        <div style={{ cursor: 'pointer' }} onClick={onClick}>
          <div className="question">{question}</div>
          <div className="plus-minus-toggle" />
        </div>
      </div>
      <div
        className="answer"
        style={{ maxHeight: isSelected ? height + answerPaddingBottom : 0 }}
      >
        <div ref={answerElement}>{answer}</div>
      </div>
    </QuestionAndAnswerStyle>
  );
};

function buildQuestionsFromLangObj(questionsObj, lang) {
  const questions = [];
  const link = (url, text) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
  let questionNum = 1;
  while (questionsObj[`question${questionNum}`]) {
    const links = [];
    let linkNum = 1;
    while (questionsObj[`answer${questionNum}_link${linkNum}_url`]) {
      links.push(
        link(
          questionsObj[`answer${questionNum}_link${linkNum}_url`],
          questionsObj[`answer${questionNum}_link${linkNum}_text`]
        )
      );
      linkNum++;
    }
    questions.push({
      q: questionsObj[`question${questionNum}`],
      a: lang.formatString(questionsObj[`answer${questionNum}`], ...links)
    });
    questionNum++;
  }
  return questions;
}

const Questions = ({ questions }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'left',
        fontSize: '18px',
        lineHeight: '25px'
      }}
    >
      {questions.map(({ q, a }, index) => {
        const isSelected = index === selectedIndex;
        return (
          <div key={q}>
            <QuestionAndAnswer
              question={q}
              answer={a}
              onClick={() => setSelectedIndex(isSelected ? null : index)}
              isSelected={isSelected}
            />
            {index < questions.length - 1 ? (
              <div
                style={{ borderBottom: '1px solid #9E9E9E', opacity: 0.9 }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

Questions.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      q: PropTypes.string,
      a: PropTypes.element
    })
  )
};

export { buildQuestionsFromLangObj };

export default Questions;